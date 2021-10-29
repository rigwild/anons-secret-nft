<script setup>
defineProps({
  anon: Object, // anon
  totalAnonsCount: Number, // anonsFixed.length
  rarityAnon: Object, // rarity.anons[anon.id]
  rarityCategoriesBackgroundsCountsAnon: Object, // rarity.categories.backgrounds.counts[anon.backgrounds]
  rarityCategoriesBasePersonCountsAnon: Object, // rarity.categories.basePerson.counts[anon.basePerson]
  rarityCategoriesHeadCountsAnon: Object, // rarity.categories.head.counts[anon.head]
  rarityCategoriesEyesCountsAnon: Object, // rarity.categories.eyes.counts[anon.eyes]
  rarityCategoriesClothesCountsAnon: Object, // rarity.categories.clothes.counts[anon.clothes]
  rarityCategoriesEarsCountsAnon: Object, // rarity.categories.ears.counts[anon.ears]
  rarityCategoriesMouthCountsAnon: Object // rarity.categories.mouth.counts[anon.mouth]
})

const setUriHash = anonId => {
  window.location.hash = `#?id=${anonId}`
  const uri = window.location.href
  navigator.clipboard.writeText(uri).then(() => alert(`URI copied to clipboard! ${uri}`))
}
</script>

<template>
  <div class="anon-card">
    <img v-lazy="anon.imageUrl" :alt="`anon ${anon.id}`" :key="anon.id" />
    <div class="anon-stats">
      <h2>
        Anon #{{ anon.id }} (Rank {{ rarityAnon.rank }} / {{ totalAnonsCount }})
        <span @click="setUriHash(anon.id)" class="pointer">🔗</span>
      </h2>
      <h4>Traits</h4>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Trait</th>
            <th class="text-right">Trait Count</th>
            <th class="text-right">Trait %</th>
            <th class="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="anon.backgrounds">
            <td>backgrounds</td>
            <td>{{ anon.backgrounds }}</td>
            <td class="text-right">{{ rarityCategoriesBackgroundsCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesBackgroundsCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesBackgroundsCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.basePerson">
            <td>basePerson</td>
            <td>{{ anon.basePerson }}</td>
            <td class="text-right">{{ rarityCategoriesBasePersonCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesBasePersonCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesBasePersonCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.head">
            <td>head</td>
            <td>{{ anon.head }}</td>
            <td class="text-right">{{ rarityCategoriesHeadCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesHeadCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesHeadCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.eyes">
            <td>eyes</td>
            <td>{{ anon.eyes }}</td>
            <td class="text-right">{{ rarityCategoriesEyesCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesEyesCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesEyesCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.clothes">
            <td>clothes</td>
            <td>{{ anon.clothes }}</td>
            <td class="text-right">{{ rarityCategoriesClothesCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesClothesCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesClothesCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.ears">
            <td>ears</td>
            <td>{{ anon.ears }}</td>
            <td class="text-right">{{ rarityCategoriesEarsCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesEarsCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesEarsCountsAnon.score.toFixed(3) }}</td>
          </tr>
          <tr v-if="anon.mouth">
            <td>mouth</td>
            <td>{{ anon.mouth }}</td>
            <td class="text-right">{{ rarityCategoriesMouthCountsAnon.count }} / {{ totalAnonsCount }}</td>
            <td class="text-right">{{ rarityCategoriesMouthCountsAnon.totalPercent.toFixed(3) }} %</td>
            <td class="text-right">{{ rarityCategoriesMouthCountsAnon.score.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
      <h3>
        Total Rarity Score: {{ rarityAnon.score.toFixed(3) }} -
        <a :href="`https://www.anons.army/anon/${anon.id}`" target="_blank" rel="noopener">See on anons.army</a>
      </h3>
    </div>
  </div>
</template>

<style scoped>
.anon-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2e3844;
  margin: 40px 0;
  border-radius: 30px;
  box-shadow: 0px 5px 24px 5px #00000042;
}
.anon-card img {
  width: 500px;
  height: 500px;
  border-radius: 30px 0px 0px 30px;
}
.anon-stats {
  width: 100%;
  padding: 0 15px;
}

@media (min-width: 375px) and (max-width: 1200px) {
  .anon-card {
    text-align: center;
    flex-direction: column;
    margin: 50px 0;
  }
  .anon-stats {
    padding: 5px;
  }
}

@media (min-width: 375px) and (max-width: 667px) {
  .anon-card img {
    height: inherit;
    width: 100%;
    border-radius: 30px 30px 0px 0px;
  }
}

@media (min-width: 668px) and (max-width: 1200px) {
  .anon-card img {
    height: inherit;
    border-radius: 30px;
    margin-top: 30px;
  }
}
</style>
