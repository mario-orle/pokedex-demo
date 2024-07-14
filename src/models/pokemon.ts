interface BasePokemon {
  name: string;
}

export interface ListPokemon extends BasePokemon {
  url: string;
}

export interface Pokemon
  extends BasePokemon,
    Partial<{
      requested: boolean;
      id: number;
      base_experience: number;
      height: number;
      is_default: boolean;
      order: number;
      weight: number;
      sprites: Partial<Sprites>;
      cries: Cries;
      types: Types[];
      moves: Moves[];
    }> {}

interface Moves {
  move: {
    name: string;
    url: string;
  };
}
interface Types {
  slot: number;
  type: { name: string; url: string };
}
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
