# TODO: Implement API Endpoints in Frontend

## Statistics Service Updates
- [x] Update `getAlkategoriaMonthlyStats` to use `/statisztika/id/{id}` API with fallback to mock data
- [x] Update `getAllAlkategoriasStats` to use `/statisztika/all` API with fallback to mock data
- [x] Add `getAllAlkategoriasStatsForYear` function for `/statisztika/ev/{ev}` API

## Auth Service Additions
- [x] Add `getUserTotalCostsByCategory` function for `/felhasznalo/{id}/osszKoltesei`
- [x] Add `getUserMonthlyCosts` function for `/felhasznalo/{id}/eHaviKoltesei`
- [x] Add `getUserYearlyCosts` function for `/felhasznalo/{id}/eEviKoltesei`
- [x] Add `createGroup` function for `/csoport/create`
- [x] Add `updateGroup` function for `/csoport/{id}` (PUT)
- [x] Add `deleteGroup` function for `/csoport/{id}` (DELETE)
- [x] Fix `registerUser` to map frontend fields to backend expected fields (nev, email, password, password_confirmation)

## Shopping List Service Additions
- [x] Add `createVevesiObjektum` function for `/vevesiObjektum/create`
- [x] Add `getAllCoupons` function for `/kuponok/get`
- [x] Add `createCoupon` function for `/kuponok/create`
- [x] Add `updateCoupon` function for `/kuponok/{id}` (PUT)
- [x] Add `deleteCoupon` function for `/kuponok/{id}` (DELETE)

## Existing Functions Verified
- [x] `getShoppingListsByUser` - `/felhasznalo/{id}/vevesiListak`
- [x] `getShoppingListById` - `/vevesiLista/{id}`
- [x] `getShoppingListsByGroup` - `/csoport/{id}/vevesiListak`
- [x] `getUserGroups` - `/felhasznalo/{id}/csoportjai`
- [x] `getUserById` - `/felhasznalo/{id}`
- [x] `loginUser` - `/felhasznalo/login`
- [x] `createShoppingList` - `/vevesiLista/create`

## Testing
- [x] Test all new functions with API calls and fallbacks
- [x] All GET and POST endpoints from the specification are implemented
