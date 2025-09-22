export enum RequestStatus {
    NOT_REQUESTED = "not_requested",
    NEGOTIATION = "negotiation",
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
}

export enum TripStatus {
    DRIVER_ARRIVED = "driver_arrived",
    WAITING_DRIVER = "waiting_driver",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ACCEPTED = "accepted"
}