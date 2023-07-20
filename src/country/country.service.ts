import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateCountryDto } from 'src/country/dto/create-country.dto'
import { MovieService } from 'src/movie/movie.service'
import { CountryCollection } from './country.interface'
import { CountryModel } from './country.model'

@Injectable()
export class CountryService {
	constructor(
		@InjectModel(CountryModel)
		private readonly CountryModel: ModelType<CountryModel>,
		private readonly movieService: MovieService
	) {}

	async bySlug(slug: string) {
		const country = await this.CountryModel.findOne({ slug }).exec()
		if (!country) throw new NotFoundException('Country not found!')

		return country
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.CountryModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	async getCollections() {
		const countries = await this.getAll()

		const collections = await Promise.all(
			countries.map(async (country) => {
				const moviesByCountry = await this.movieService.byCountries({
					countryIds: [country._id],
				})

				const result: CountryCollection = {
					_id: String(country._id),
					image: moviesByCountry[0]?.bigPoster
						? moviesByCountry[0].bigPoster
						: '/uploads/movies/background-image.png',
					slug: country.slug,
					title: country.name,
				}

				return result
			})
		)

		return collections
	}

	async byId(_id: string) {
		const country = await this.CountryModel.findById(_id)
		if (!country) throw new NotFoundException('Country not found!')

		return country
	}

	async create() {
		const defaultValue: CreateCountryDto = {
			name: '',
			slug: '',
		}
		const country = await this.CountryModel.create(defaultValue)
		return country._id
	}

	async update(_id: string, dto: CreateCountryDto) {
		const updateDoc = await this.CountryModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Country not found')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.CountryModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Country not found')

		return deleteDoc
	}
}
