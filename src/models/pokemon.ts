interface BasePokemon {
  name: string;
}

export interface ListPokemon extends BasePokemon {
  url: string;
}

export interface Pokemon
  extends BasePokemon,
    Partial<{
      id: number;
      base_experience: number;
      height: number;
      is_default: boolean;
      order: number;
      weight: number;
      sprites: Partial<Sprites>;
      cries: Cries;
      requested: boolean;
    }> {}

interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}

interface Cries {
  latest: string;
  legacy: string;
}
