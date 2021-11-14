export type Anon = {
  id: number
  backgrounds: string
  basePerson: string
  head: string
  eyes: string
  clothes: string
  ears: string
  mouth: string
  specialNote?: string
  imageUrl: string
  revealed: boolean
}

export type TraitRarity = { count: number; totalPercent: number; score: number }
export type CategoryRarity = { [trait: string]: TraitRarity }
export type AnonRarity = { score: number; rank: number }
export type AnonsRarity = {
  anons: { [id: number]: AnonRarity }
  categories: { [category: string]: CategoryRarity }
  traitsAmountRarity: { [traitsCount: string]: { count: number; percent: number } }
}

export type AnonTraitInfo = TraitRarity & { name: string }
export type AnonWithRarity = Anon & {
  rarity: AnonRarity & {
    traits: {
      backgrounds: AnonTraitInfo
      basePerson: AnonTraitInfo
      head: AnonTraitInfo
      eyes: AnonTraitInfo
      clothes: AnonTraitInfo
      ears: AnonTraitInfo
      mouth: AnonTraitInfo
    }
  }
}
