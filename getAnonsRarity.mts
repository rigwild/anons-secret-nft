import { fetch, argv, fs } from 'zx'
import type { Anon, AnonWithRarity, AnonsRarity, CategoryRarity, TraitRarity } from './types'

const loadOrFetchThenCache = async (file: string, loadFn: () => Promise<any>) => {
  if (await fs.pathExists(file)) return fs.readJson(file)
  else {
    const res = await loadFn()
    await fs.writeJSON(file, res, { spaces: 2 })
    return res
  }
}

const getTraits = async (category: string): Promise<string[]> =>
  loadOrFetchThenCache(`_input_traits_${category}.json`, () =>
    fetch(`https://api.anons.army/api/anons/${category}`)
      .then(res => res.json())
      .then(res => res.sort())
  )

const getAnons = async (): Promise<Anon[]> => {
  const res = await loadOrFetchThenCache('_input_anons.json', () =>
    fetch('https://api.anons.army/api/anons?size=580').then(res => res.json())
  )
  return res.content
}

const pad = (n, l = 3) => (n + '').padStart(l, ' ')
const percent = (a, b) => (a / b) * 100
const percentStr = (r, p = 5) => `${pad(r.toFixed(2), p)} %`

const [backgrounds, basePerson, head, eyes, clothes, ears, mouth] = await Promise.all([
  getTraits('backgrounds'),
  getTraits('base-persons'),
  getTraits('heads'),
  getTraits('eyes'),
  getTraits('clothes'),
  getTraits('ears'),
  getTraits('mouths')
])
const traits = { backgrounds, basePerson, head, eyes, clothes, ears, mouth }
const traitsCategories = Object.keys(traits)

const anons = await getAnons()
// console.log(anons)

// Replace anons null traits with "None"
anons.forEach(anon =>
  traitsCategories.forEach(category => {
    if (anon[category] === null) anon[category] = 'None'
  })
)
// Add "None" traits to categories
traitsCategories.forEach(category => traits[category].push('None'))

const rarity: AnonsRarity = {} as any

// Traits rarity
rarity.categories = Object.entries(traits).reduce<Record<string, CategoryRarity>>((acc, [category, traits]) => {
  const traitsCounts = traits.reduce<Record<string, number>>((tacc, trait) => {
    tacc[trait] = anons.filter(anon => anon[category] === trait).length
    return tacc
  }, {})

  acc[category] = Object.entries(traitsCounts).reduce<Record<string, TraitRarity>>((tacc, [trait, traitCount]) => {
    tacc[trait] = {
      count: traitCount,
      totalPercent: percent(traitCount, anons.length),
      score: 1 / (traitCount / anons.length)
    }
    return tacc
  }, {})
  return acc
}, {})

// Anons rarity
// Compute scores https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c
const scores = anons.reduce<Record<string, number>>((acc, anon) => {
  acc[anon.id] = traitsCategories.reduce<number>((acc, category) => {
    if (!!anon[category]) return acc + rarity.categories[category][anon[category]].score
    else return acc
  }, 0)
  return acc
}, {})
// Compute rank
rarity.anons = Object.fromEntries(
  Object.entries(scores)
    .sort(([, ascore], [, bscore]) => bscore - ascore)
    .map(([id, score], i) => [id, { score, rank: i + 1 }])
)
// console.log(scores)
// console.log(rarity.anons)

// Traits count rarity (bonus, not counted in scores)
const countTraits = (anon: Anon) => {
  return traitsCategories.reduce((acc, category) => (!!anon[category] && anon[category] !== 'None' ? ++acc : acc), 0)
}
rarity.traitsAmountRarity = anons.reduce((acc, anon) => {
  const count = countTraits(anon)
  if (count in acc) acc[count].count++
  else acc[count] = { count: 1 }
  return acc
}, {})
Object.entries(rarity.traitsAmountRarity).forEach(
  ([amount, { count }]) => (rarity.traitsAmountRarity[amount].percent = percent(count, anons.length))
)
// console.dir(rarity, { depth: null })

// Merge
const anonsWithRarity: AnonWithRarity[] = anons.map(anon => {
  const res: AnonWithRarity = { ...anon } as any
  res.rarity = {
    ...rarity.anons[anon.id],
    traits: {
      backgrounds: { ...rarity.categories.backgrounds[anon.backgrounds], name: anon.backgrounds },
      basePerson: { ...rarity.categories.basePerson[anon.basePerson], name: anon.basePerson },
      head: { ...rarity.categories.head[anon.head], name: anon.head },
      eyes: { ...rarity.categories.eyes[anon.eyes], name: anon.eyes },
      clothes: { ...rarity.categories.clothes[anon.clothes], name: anon.clothes },
      ears: { ...rarity.categories.ears[anon.ears], name: anon.ears },
      mouth: { ...rarity.categories.mouth[anon.mouth], name: anon.mouth }
    }
  }
  return res
})

// Save as files
if (argv.out) {
  await fs.writeJSON('_output_anonsNullTraitsAsNone.json', anons, { spaces: 2 })
  await fs.writeJSON('_output_rarity.json', rarity, { spaces: 2 })
  await fs.writeJSON('_output_anonsWithRarity.json', anonsWithRarity, { spaces: 2 })
}

// Log JSON
if (argv.json) {
  console.log(JSON.stringify(anonsWithRarity, null, 2))
  process.exit(0)
}

console.log(`Total Minted Anons: ${anons.length}`)
console.log()

console.log('Traits rarity:\n')
Object.entries(rarity.categories).forEach(([categoryName, categoryRarity]) => {
  console.log(`${categoryName}`)

  Object.entries(categoryRarity).forEach(([trait, { count, totalPercent }]) =>
    console.log(`  ${pad(count)} of ${anons.length} - ${percentStr(totalPercent)} - ${trait}`)
  )
  console.log()
})

console.log()
console.log('Traits Amount Rarity:')
// console.log(rarity.traitsAmountRarity)
Object.entries(rarity.traitsAmountRarity).forEach(([amount, { count, percent }]) =>
  console.log(`  ${amount} traits: ${pad(count)} of ${anons.length} - ${percentStr(percent)}`)
)

console.log()
console.log()
const logAnon = (id, score, rank) =>
  console.log(
    `  ${pad(id, 3)}: Ranked ${pad(rank, 3)} of ${anons.length} - ` +
      `score ${pad(score.toFixed(8), 12)} - https://www.anons.army/anon/${id}`
  )
console.log('Anons Rarity Score:')
Object.entries(rarity.anons).forEach(([id, { score, rank }]) => logAnon(id, score, rank))

console.log()
console.log()
console.log('Anons Rarity Score (sorted):')
Object.entries(rarity.anons)
  .sort((a, b) => b[1].score - a[1].score)
  .forEach(([id, { score, rank }]) => logAnon(id, score, rank))
