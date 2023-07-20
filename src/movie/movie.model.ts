import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { ActorModel } from 'src/actor/actor.model'
import { CountryModel } from 'src/country/country.model'
import { GenreModel } from 'src/genre/genre.model'

export interface MovieModel extends Base {}

export class Parameters {
	@prop()
	year: number

	@prop()
	duration: number
}

export class MovieModel extends TimeStamps {
	@prop()
	poster: string

	@prop()
	bigPoster: string

	@prop()
	title: string

	@prop({ unique: true })
	slug: string

	@prop()
	parameters?: Parameters

	@prop({ default: 4.0 })
	rating?: number

	@prop()
	videoUrl: string

	@prop({ default: 0 })
	countOpened?: number

	@prop({ ref: () => GenreModel })
	genres: Ref<GenreModel>[]

	@prop({ ref: () => CountryModel })
	countries: Ref<CountryModel>[]

	@prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>[]

	@prop({ default: false })
	isSendTelegram?: boolean
}
