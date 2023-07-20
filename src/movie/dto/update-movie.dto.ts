import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator'

export class Parameters {
	@IsNumber()
	year: number

	@IsNumber()
	duration: number
}

export class UpdateMovieDto {
	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	title: string

	@IsString()
	slug: string

	@IsOptional()
	@IsObject()
	parameters?: Parameters

	@IsString()
	videoUrl: string

	@IsArray()
	@IsString({ each: true })
	genres: string[]

	@IsArray()
	@IsString({ each: true })
	countries: string[]

	@IsArray()
	@IsString({ each: true })
	actors: string[]

	@IsOptional()
	@IsBoolean()
	isSendTelegram?: boolean
}
