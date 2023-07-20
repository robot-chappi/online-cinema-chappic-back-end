import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { GetByCountriesDto } from './dto/get-by-countries.dto'
import { GetByGenresDto } from './dto/get-by-genres.dto'
import { UpdateCountOpenedDto } from './dto/update-count-opened.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.movieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.byActor(actorId)
	}

	@UsePipes(new ValidationPipe())
	@Post('by-genres')
	@HttpCode(200)
	async byGenres(@Body() dto: GetByGenresDto) {
		return this.movieService.byGenres(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('by-countries')
	@HttpCode(200)
	async byCountries(@Body() dto: GetByCountriesDto) {
		return this.movieService.byCountries(dto)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAll(searchTerm)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@UsePipes(new ValidationPipe())
	@Patch('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body() dto: UpdateCountOpenedDto) {
		return this.movieService.updateCountOpened(dto)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateMovieDto
	) {
		return this.movieService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.delete(id)
	}
}
