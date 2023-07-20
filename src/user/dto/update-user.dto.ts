import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean
}
