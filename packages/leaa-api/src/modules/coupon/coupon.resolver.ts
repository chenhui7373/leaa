import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Coupon, User } from '@leaa/common/src/entrys';
import {
  CouponsArgs,
  CouponsWithPaginationObject,
  CouponArgs,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import { CurrentUser, Permissions } from '@leaa/api/src/decorators';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';
import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';
import { PermissionsGuard } from '@leaa/api/src/guards';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private readonly couponService: CouponService, private readonly couponProperty: CouponProperty) {}

  @ResolveProperty(() => Boolean)
  available(@Parent() coupon: Coupon): boolean {
    return this.couponProperty.available(coupon);
  }

  @ResolveProperty(() => Boolean)
  canRedeem(@Parent() coupon: Coupon): boolean {
    return this.couponProperty.canRedeem(coupon);
  }

  //

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.list-read')
  @Query(() => CouponsWithPaginationObject)
  async coupons(
    @Args() args: CouponsArgs,
    @CurrentUser() user?: User,
  ): Promise<CouponsWithPaginationObject | undefined> {
    return this.couponService.coupons(args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async coupon(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: CouponArgs,
    @CurrentUser() user?: User,
  ): Promise<Coupon | undefined> {
    return this.couponService.coupon(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-read')
  @Query(() => Coupon)
  async couponByCode(
    @Args({ name: 'code', type: () => String }) code: string,
    @Args() args?: CouponArgs,
    @CurrentUser() user?: User,
  ): Promise<Coupon | undefined> {
    return this.couponService.couponByCode(code, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-create')
  @Mutation(() => Coupon)
  async createCoupon(@Args('coupon') args: CreateCouponInput): Promise<Coupon | undefined> {
    return this.couponService.createCoupon(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-update')
  @Mutation(() => Coupon)
  async updateCoupon(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('coupon') args: UpdateCouponInput,
  ): Promise<Coupon | undefined> {
    return this.couponService.updateCoupon(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('coupon.item-delete')
  @Mutation(() => Coupon)
  async deleteCoupon(@Args({ name: 'id', type: () => Int }) id: number): Promise<Coupon | undefined> {
    return this.couponService.deleteCoupon(id);
  }

  @Mutation(() => Coupon)
  async redeemCoupon(@Args('info') info: RedeemCouponInput, @CurrentUser() user?: User): Promise<Coupon | undefined> {
    return this.couponService.redeemCoupon(info, user);
  }
}
