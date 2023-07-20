import { IsArray, IsNotEmpty, MinLength } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'
import { Types } from 'mongoose'

export class GetByCountriesDto {
	@IsArray()
	@IsNotEmpty()
	@IsObjectId({ each: true, message: 'Country Id is invalid!' })
	@MinLength(24, { each: true })
	countryIds: Types.ObjectId[]
}
