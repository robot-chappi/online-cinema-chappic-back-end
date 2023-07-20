import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModule } from 'src/movie/movie.module'
import { CountryController } from './country.controller'
import { CountryModel } from './country.model'
import { CountryService } from './country.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CountryModel,
				schemaOptions: {
					collection: 'Country',
				},
			},
		]),
		MovieModule,
	],
	providers: [CountryService],
	controllers: [CountryController],
})
export class CountryModule {}
