import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: FetchAdapter,
  ) {

  }

  async executeSeed() {

    await this.pokemonModel.deleteMany()

    const response = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=300')
    const data = response.results
    // const data = await <PokeResponse><unknown>response.json()

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]
      pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'seed executed'
  }
}
