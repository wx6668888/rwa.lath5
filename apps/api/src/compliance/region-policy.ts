import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * 地域准入策略。原型从环境变量 ALLOWED_REGIONS 读取白名单；
 * 取值 'ALL'（默认）表示允许所有地域。生产由合规配置下发。
 */
@Injectable()
export class RegionPolicy {
  private readonly allowed: Set<string>

  constructor(config: ConfigService) {
    const raw = (config.get<string>('ALLOWED_REGIONS') ?? 'ALL').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
    this.allowed = new Set(raw)
  }

  isAllowed(region: string): boolean {
    return this.allowed.has('ALL') || this.allowed.has(region.trim().toUpperCase())
  }

  requireAllowed(region: string): boolean {
    return this.isAllowed(region)
  }
}
