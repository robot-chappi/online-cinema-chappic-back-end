import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from 'src/movie/dto/update-movie.dto'
import { TelegramService } from 'src/telegram/telegram.service'
import { GetByCountriesDto } from './dto/get-by-countries.dto'
import { GetByGenresDto } from './dto/get-by-genres.dto'
import { UpdateCountOpenedDto } from './dto/update-count-opened.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres countries')
			.exec()
	}

	async bySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres countries')
			.exec()
		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async byActor(actorId: Types.ObjectId) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec()
		if (!movies) throw new NotFoundException('Movies not found!')

		return movies
	}

	async byGenres({ genreIds }: GetByGenresDto) {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIds },
		}).exec()
		if (!movies) throw new NotFoundException('Movies not found!')

		return movies
	}

	async byCountries({ countryIds }: GetByCountriesDto) {
		const movies = await this.MovieModel.find({
			countries: { $in: countryIds },
		}).exec()
		if (!movies) throw new NotFoundException('Movies not found!')

		return movies
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres countries')
			.exec()
	}

	async updateCountOpened({ slug }: UpdateCountOpenedDto) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			},
			{
				new: true,
			}
		).exec()

		if (!updateDoc) throw new NotFoundException('Movie not found')

		return updateDoc
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating,
			},
			{
				new: true,
			}
		).exec()
	}

	async byId(_id: string) {
		const movie = await this.MovieModel.findById(_id)
		if (!movie) throw new NotFoundException('Movie not found!')

		return movie
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			countries: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Movie not found')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Movie not found')

		return deleteDoc
	}

	async sendNotification(dto: UpdateMovieDto) {
		// if(process.env.NODE_ENV !== 'development') await this.telegramService.sendPhoto(dto.poster)
		await this.telegramService.sendPhoto(
			'https://cdn-l-cyberpunk.cdprojektred.com/edgerunners/Cyberpunk-Edgerunners-S1-Poster-en.jpg'
		)
		const msg = `<b>${dto.title}</b>`

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: '🍿 Go to watch!',
						},
					],
				],
			},
		})
	}
}
