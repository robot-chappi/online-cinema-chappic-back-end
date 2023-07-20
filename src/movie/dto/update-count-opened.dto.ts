import { IsString } from 'class-validator'

export class UpdateCountOpenedDto {
	@IsString()
	slug: string
}
