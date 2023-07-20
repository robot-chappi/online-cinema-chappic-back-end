import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingModel } from './rating.model'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly RatingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService
	) {}

	async getMovieValueByUser(movie: Types.ObjectId, user: Types.ObjectId) {
		return this.RatingModel.findOne({ movie, user })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0))
	}

	async averageRatingByMovie(movie: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate()
			.match({
				movie: new Types.ObjectId(movie),
			})
			.exec()

		return (
			ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingsMovie.length
		)
	}

	async setRating(user: Types.ObjectId, { movie, value }: SetRatingDto) {
		const newRating = await this.RatingModel.findOneAndUpdate(
			{ user, movie },
			{
				movie,
				user,
				value,
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		).exec()

		const averageRating = await this.averageRatingByMovie(movie)

		await this.movieService.updateRating(movie, averageRating)

		return newRating
	}
}
