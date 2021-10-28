// $ zx getAnonsRarity.mjs --quiet
// $ zx getAnonsRarity.mjs --quiet --json
// $ zx getAnonsRarity.mjs --quiet --json  > _results.log

import { fetch, argv, fs } from 'zx'

// @ts-check
const ngmi = uri => fetch(uri).then(res => res.json())
const getTraits = category => ngmi(`https://api.anons.army/api/anons/${category}`).then(res => res.sort())
const count = (data, category, trait) => data.filter(x => x[category] === trait).length
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

const data = await ngmi('https://api.anons.army/api/anons?size=580').then(res => res.content.filter(x => x.revealed))
if (argv.out) await fs.writeJSON('_anons.json', data, { spaces: 2 })
const mintedAnonsCount = data.length
// console.log(data)

// Replace anons null traits with "None"
data.forEach(x => traitsCategories.forEach(category => x[category] === null && (x[category] = 'None')))
// Add "None" traits
traitsCategories.forEach(category => traits[category].push('None'))

/**
 * @typedef {{ count: number; traitPercent: number; totalPercent: number; score: number }} TraitRarity
 * @typedef {{ categoryTotal: number; categoryPercent: number; counts: { [trait: string]: TraitRarity] } }} CategoryRarity
 * @typedef {{ anons: { [id: number]: { score: number; rank: number } }; categories: { [category: string]: CategoryRarity }; traitsAmountRarity: { [traitsCount: string]: { count: number; percent: number } } }} AnonsRarity
 */

/** @type {AnonsRarity} */
const rarity = {}

// Traits rarity
rarity.categories = Object.entries(traits).reduce((acc, [category, traits]) => {
  let categoryTotal = 0

  const traitsCounts = traits.reduce((tacc, trait) => {
    tacc[trait] = count(data, category, trait)
    categoryTotal += tacc[trait]
    return tacc
  }, {})

  acc[category] = {
    categoryTotal,
    categoryPercent: percent(categoryTotal, mintedAnonsCount),
    counts: Object.entries(traitsCounts).reduce((tacc, [trait, count]) => {
      tacc[trait] = {
        count,
        traitPercent: percent(count, categoryTotal),
        totalPercent: percent(count, mintedAnonsCount),
        score: 1 / (count / mintedAnonsCount)
      }
      return tacc
    }, {})
  }
  return acc
}, {})

// Anons rarity
// Compute scores https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c
const scores = data.reduce((acc, anon) => {
  acc[anon.id] = traitsCategories.reduce(
    (acc, category) => (!!anon[category] ? acc + rarity.categories[category].counts[anon[category]].score : acc),
    0
  )
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

// Traits count rarity
const countTraits = anon => traitsCategories.reduce((acc, category) => (!!anon[category] ? ++acc : acc), 0)
rarity.traitsAmountRarity = data.reduce((acc, anon) => {
  const count = countTraits(anon)
  if (count in acc) acc[count].count++
  else acc[count] = { count: 1 }
  return acc
}, {})
Object.entries(rarity.traitsAmountRarity).forEach(
  ([amount, { count }]) => (rarity.traitsAmountRarity[amount].percent = percent(count, mintedAnonsCount))
)

// console.dir(rarity, { depth: null })

// Print results

if (argv.out) await fs.writeJSON('_rarity.json', rarity, { spaces: 2 })

if (argv.json) {
  console.log(JSON.stringify(rarity, null, 2))
  process.exit(0)
}

console.log(`Total Minted Anons: ${mintedAnonsCount}`)
console.log()

console.log('Categories rarity:\n')
Object.entries(rarity.categories).forEach(([categoryName, categoryRarity]) => {
  console.log(
    `${categoryName} (${categoryRarity.categoryTotal} of ${mintedAnonsCount} - ${categoryRarity.categoryPercent} %):`
  )

  Object.entries(categoryRarity.counts).forEach(([trait, { count, traitPercent, totalPercent }]) =>
    console.log(
      `  ${pad(count)} of ${categoryRarity.categoryTotal} ` +
        `(trait: ${percentStr(traitPercent)}, total: ${percentStr(totalPercent)}) - ${trait}`
    )
  )
  console.log()
})

console.log()
console.log('Traits Amount Rarity:')
// console.log(rarity.traitsAmountRarity)
Object.entries(rarity.traitsAmountRarity).forEach(([amount, { count, percent }]) =>
  console.log(`  ${amount} traits: ${pad(count)} of ${mintedAnonsCount} - ${percentStr(percent)}`)
)

console.log()
console.log()
const logAnon = (id, score, rank) =>
  console.log(
    `  ${pad(id, 3)}: Ranked ${pad(rank, 3)} of ${mintedAnonsCount} ` +
      `(score: ${pad(score.toFixed(8), 12)}) - https://www.anons.army/anon/${id}`
  )
console.log('Anons Rarity Score:')
Object.entries(rarity.anons).forEach(([id, { score, rank }]) => logAnon(id, score, rank))

console.log()
console.log()
console.log('Anons Rarity Score (sorted):')
Object.entries(rarity.anons)
  .sort((a, b) => b[1].score - a[1].score)
  .forEach(([id, { score, rank }]) => logAnon(id, score, rank))
