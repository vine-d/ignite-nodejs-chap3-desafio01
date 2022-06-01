import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("game")
      .where("title ILIKE :param", { param: `%${param}%` })
      .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(`SELECT COUNT(id) FROM games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository.createQueryBuilder()
    .from(User, "users")
    .innerJoin("users.games", "game")
    .select("users")
    .where("game.id = :id", { id: id })
    .getMany()
  }
}
