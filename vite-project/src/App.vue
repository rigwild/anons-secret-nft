<script setup>
import { ref } from 'vue'
import anonsFixed from '../../_anons.json'
import rarity from '../../_rarity.json'

console.log('anons', anonsFixed)
console.log('rarity', rarity)

const uriId = () => {
  const matches = window.location.hash.match(/id=(\d+)/)
  return matches ? matches[1] : ''
}

let anons = ref(anonsFixed)
let filterId = ref(uriId())
let filterTrait = ref('')
let sortBy = ref('id')

const filterAnonsById = () => {
  filterTrait.value = ''
  if (!filterId.value) {
    anons.value = anonsFixed
    sortAnons()
  } else {
    const results = anonsFixed.find(x => filterId.value === `${x.id}`)
    anons.value = results ? [results] : []
  }
}
const filterAnonsByTrait = () => {
  filterId.value = ''
  filterTrait.value = filterTrait.value.toLowerCase()
  if (!filterTrait.value) {
    anons.value = anonsFixed
    sortAnons()
  } else {
    anons.value = anonsFixed.filter(
      x =>
        (!!x.backgrounds && x.backgrounds.toLowerCase().includes(filterTrait.value)) ||
        (!!x.basePerson && x.basePerson.toLowerCase().includes(filterTrait.value)) ||
        (!!x.head && x.head.toLowerCase().includes(filterTrait.value)) ||
        (!!x.eyes && x.eyes.toLowerCase().includes(filterTrait.value)) ||
        (!!x.clothes && x.clothes.toLowerCase().includes(filterTrait.value)) ||
        (!!x.ears && x.ears.toLowerCase().includes(filterTrait.value)) ||
        (!!x.mouth && x.mouth.toLowerCase().includes(filterTrait.value))
    )
  }
}

const sortAnons = () => {
  if (sortBy.value === 'id') sortById()
  else if (sortBy.value === 'score') sortByScore()
}
const sortById = () => (anons.value = anons.value.sort((a, b) => a.id - b.id))
const sortByScore = () =>
  (anons.value = anons.value.sort((a, b) => rarity.anons[b.id].score - rarity.anons[a.id].score))

const setUriHash = anonId => {
  window.location.hash = `#?id=${anonId}`
  const uri = window.location.href
  navigator.clipboard.writeText(uri).then(() => alert(`URI copied to clipboard! ${uri}`))
}

// Init uri anon id
if (uriId()) {
  filterId.value = uriId()
  filterAnonsById()
}
</script>

<template>
  <div class="credits">
    <div><a href="https://github.com/rigwild/anons-secret-nft">Available on GitHub</a></div>
    <div>Made with ❤ by <a href="https://github.com/rigwild">rigwild</a></div>
  </div>

  <h1 class="text-center">Anons NFT Rarity Scores</h1>
  <div class="actions">
    <button @click=";(sortBy = 'id'), sortAnons()">Sort by Anon ID</button>
    <button @click=";(sortBy = 'score'), sortAnons()">Sort by Score</button>
    <div>
      <div>
        <label for="filterId">Anon ID</label>
        <input
          v-model="filterId"
          @input="filterAnonsById"
          id="filterId"
          type="text"
          placeholder="Filter by Anon ID"
          maxlength="3"
        />
      </div>
      <div>
        <label for="filterTrait">Trait Name</label>
        <input
          v-model="filterTrait"
          @input="filterAnonsByTrait"
          id="filterTrait"
          type="text"
          placeholder="Filter by Trait Name"
        />
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-center">{{ anons.length }} / {{ anonsFixed.length }} Anons</h2>
  </div>
  <div v-if="anons.length === 0">
    <h2 class="text-center">No anons found!</h2>
  </div>
  <div v-else v-for="anon of anons" class="anon-card" :key="anon.id">
    <img v-lazy="anon.imageUrl" :alt="`anon ${anon.id}`" />
    <div class="anon-stats">
      <h2>
        Anon #{{ anon.id }} (Rank {{ rarity.anons[anon.id].rank }} / {{ anonsFixed.length }})
        <span @click="setUriHash(anon.id)" class="pointer">🔗</span>
      </h2>
      <h4>Traits</h4>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Trait</th>
            <th>Trait Count</th>
            <th>Trait %</th>
            <th>Total %</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="anon.backgrounds">
            <td>backgrounds</td>
            <td>{{ anon.backgrounds }}</td>
            <td>{{ rarity.categories.backgrounds.counts[anon.backgrounds].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.backgrounds.counts[anon.backgrounds].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.backgrounds.counts[anon.backgrounds].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.backgrounds.counts[anon.backgrounds].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.basePerson">
            <td>basePerson</td>
            <td>{{ anon.basePerson }}</td>
            <td>{{ rarity.categories.basePerson.counts[anon.basePerson].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.basePerson.counts[anon.basePerson].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.basePerson.counts[anon.basePerson].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.basePerson.counts[anon.basePerson].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.head">
            <td>head</td>
            <td>{{ anon.head }}</td>
            <td>{{ rarity.categories.head.counts[anon.head].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.head.counts[anon.head].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.head.counts[anon.head].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.head.counts[anon.head].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.eyes">
            <td>eyes</td>
            <td>{{ anon.eyes }}</td>
            <td>{{ rarity.categories.eyes.counts[anon.eyes].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.eyes.counts[anon.eyes].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.eyes.counts[anon.eyes].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.eyes.counts[anon.eyes].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.clothes">
            <td>clothes</td>
            <td>{{ anon.clothes }}</td>
            <td>{{ rarity.categories.clothes.counts[anon.clothes].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.clothes.counts[anon.clothes].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.clothes.counts[anon.clothes].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.clothes.counts[anon.clothes].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.ears">
            <td>ears</td>
            <td>{{ anon.ears }}</td>
            <td>{{ rarity.categories.ears.counts[anon.ears].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.ears.counts[anon.ears].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.ears.counts[anon.ears].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.ears.counts[anon.ears].score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.mouth">
            <td>mouth</td>
            <td>{{ anon.mouth }}</td>
            <td>{{ rarity.categories.mouth.counts[anon.mouth].count }} / {{ anonsFixed.length }}</td>
            <td>{{ rarity.categories.mouth.counts[anon.mouth].traitPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.mouth.counts[anon.mouth].totalPercent.toFixed(3) }}</td>
            <td>{{ rarity.categories.mouth.counts[anon.mouth].score.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
      <h3>
        Total Rarity Score: {{ rarity.anons[anon.id].score.toFixed(3) }} -
        <a :href="`https://www.anons.army/anon/${anon.id}`" target="_blank" rel="noopener">See on anons.army</a>
      </h3>
    </div>
  </div>

  <div class="credits">
    <div><a href="https://github.com/rigwild/anons-secret-nft">Available on GitHub</a></div>
    <div>Made with ❤ by <a href="https://github.com/rigwild">rigwild</a></div>
  </div>
</template>

<style>
body {
  max-width: 1350px;
}
.text-center {
  text-align: center;
}
.pointer {
  cursor: pointer;
}
.actions {
  text-align: center;
  margin: 15px;
}
.actions input {
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;
}
.actions > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.actions > div > div {
  margin: 15px;
}
.anon-card {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  background-color: #2e3844;
  margin: 20px 0;
}
.anon-card img {
  width: 400px;
  height: 400px;
}
.anon-stats {
  width: 100%;
  padding: 0 15px;
}
.credits {
  text-align: center;
  margin: 15px;
}

/* Portrait and Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  body {
    padding: 0;
  }
  .anon-card {
    flex-direction: column;
    margin: 50px 0;
  }
  .anon-card img {
    height: inherit;
  }
  .anon-stats {
    padding: 5px;
  }
  .actions > div {
    flex-direction: column;
  }
}
</style>
