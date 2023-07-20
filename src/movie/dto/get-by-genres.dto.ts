import { IsArray, IsNotEmpty, MinLength } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'
import { Types } from 'mongoose'

export class GetByGenresDto {
	@IsArray()
	@IsNotEmpty()
	@IsObjectId({ each: true, message: 'Genre Id is invalid!' })
	@MinLength(24, { each: true })
	genreIds: Types.ObjectId[]
}
