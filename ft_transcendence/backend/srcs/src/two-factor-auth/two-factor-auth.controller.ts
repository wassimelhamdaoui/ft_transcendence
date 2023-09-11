import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private twoFactorAuthService: TwoFactorAuthService) {}
  @Get('qrcode')
  @UseGuards(JwtGuard)
  generateQrCode(@Req() req: Request) {
    const qrcode = this.twoFactorAuthService.generateQrCode(req.user as User);
    return qrcode;
  }

  @Post('verify')
  @UseGuards(JwtGuard)
  twoFactorAuth(@Body() { code }: { code: string }, @Req() req: Request) {
    return this.twoFactorAuthService.verify(code, req.user as User);
  }
}
