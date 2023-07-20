import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface CountryModel extends Base {}

export class CountryModel extends TimeStamps {
	@prop()
	name: string

	@prop({ unique: true })
	slug: string
}
