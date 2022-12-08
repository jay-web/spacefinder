import Space from "../model/space.schema";
import Reservation from "../model/reservation.schema";

export class MissingFieldError extends Error {};

export function SpaceInputValidator(args: any) {
    if(!(args as Space).name){
        throw new MissingFieldError("Value of space name is missing !!! 😑")
    }
    if(!(args as Space).location){
        throw new MissingFieldError("Value of space location is missing !!! 😑")
    }
    if(!(args as Space).spaceId){
        throw new MissingFieldError("Value of space Id is missing !!! 😑")
    }
    
}

export function ReservationInputValidator(args: any){
    if(!(args as Reservation).reservationId){
        throw new MissingFieldError("Reservation ID is missing !!! 🙄")
    }
    if(!(args as Reservation).spaceId){
        throw new MissingFieldError("Space Id is missing !!! 🙄")
    }
    if(!(args as Reservation).user){
        throw new MissingFieldError("User info is missing !!! 🙄")
    }
    if(!(args as Reservation).status){
        throw new MissingFieldError("Status is missing !!! 🙄")
    }
}