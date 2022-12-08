export default interface Reservation {
    reservationId: string,
    spaceId: string,
    user: {
        sub: string,
        username: string
    },
    status: ReservationState
    
}

export type ReservationState = 'PENDING' | 'APPROVED' | 'CANCELLED'