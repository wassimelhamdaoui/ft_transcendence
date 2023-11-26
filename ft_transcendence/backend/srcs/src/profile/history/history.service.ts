import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarFromLogin } from 'src/utils/get-avatar-from-login';
import { getUserFromId, getUserFromLogin } from 'src/utils/get-user-from-id';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}
  async getAllMatchesPlayed(login: string) {
    try {
      const matchesPlayedByUser = await this.prisma.game.findMany({
        where: {
          OR: [{ player1: { login: login } }, { player2: { login: login } }],
        },
        orderBy: {
          dateOfGame: 'desc',
        },
      });

      const user = await getUserFromLogin(login);

      const matches = [];

      for (const match of matchesPlayedByUser) {
        const me = await getUserFromId(
          match.player1Id == user.id ? match.player1Id : match.player2Id,
        );
        const other = await getUserFromId(
          match.player2Id == user.id ? match.player1Id : match.player2Id,
        );

        const matchData = {
          id: match.id,
          me: me.login,
          other: other.login,
          myAvatar: getAvatarFromLogin(me.login),
          otherAvatar: getAvatarFromLogin(other.login),
          myScore: me.id == match.player1Id ? match.scoreOfPlayer1 : match.scoreOfPlayer2,
          otherScore: other.id == match.player1Id ? match.scoreOfPlayer1 : match.scoreOfPlayer2,
        };
        matches.push(matchData);
      }
      return matches;
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
  }
}
