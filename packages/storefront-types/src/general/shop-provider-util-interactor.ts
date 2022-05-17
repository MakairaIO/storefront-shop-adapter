import { MakairaShopProvider } from "../provider";

export type MakairaShopUtilInteractor<
  ShopProvider extends MakairaShopProvider,
  ShopProviderInteractor extends (...args: any) => any
> = (
  shopProvider: ShopProvider,
  ...args: Parameters<ShopProviderInteractor>
) => ReturnType<ShopProviderInteractor>;
