import { useState } from "react";
import { supabase } from "../services/supabase";

export interface Booking {
  id: string;
  route_id: string;
  passenger_id: string;
  seat_number: number;
  price: number;
  payment_method?: string;
  payment_status: string;
  booking_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    routeId: string,
    passengerId: string,
    seatNumber: number,
    price: number,
    paymentMethod: string = "cash"
  ) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            route_id: routeId,
            passenger_id: passengerId,
            seat_number: seatNumber,
            price,
            payment_method: paymentMethod,
            payment_status: "pending",
            booking_status: "confirmed",
          },
        ])
        .select()
        .single();

      if (bookingError) {
        // Manejar error de asiento ya reservado
        if (bookingError.code === '23505' || bookingError.message.includes('unique')) {
          const customError = new Error('Este asiento ya fue reservado. Por favor selecciona otro.');
          ;(customError as any).code = 'SEAT_ALREADY_RESERVED';
          throw customError;
        }
        throw bookingError;
      }

      // Update available_seats in routes
      const { error: updateError } = await supabase.rpc(
        "decrement_available_seats",
        {
          route_id: routeId,
        }
      );

      if (updateError) {
        // Fallback: manually update if RPC doesn't exist
        const { data: routeData, error: routeFetchError } = await supabase
          .from("routes")
          .select("available_seats")
          .eq("id", routeId)
          .single();

        if (!routeFetchError && routeData) {
          const newAvailableSeats = Math.max((routeData.available_seats ?? 0) - 1, 0);
          const { error: routeUpdateError } = await supabase
            .from("routes")
            .update({ available_seats: newAvailableSeats })
            .eq("id", routeId);

          if (routeUpdateError) {
            console.warn("Error decrementing available seats fallback:", routeUpdateError);
          }
        } else {
          console.warn("Error fetching route for fallback seat decrement:", routeFetchError);
        }
      }

      return data;
    } catch (err: any) {
      const message = err.message || "Error creating booking";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPassengerBookings = async (passengerId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`*, routes:route_id(*)`)
        .eq("passenger_id", passengerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data;
    } catch (err: any) {
      const message = err.message || "Error fetching bookings";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRouteBookings = async (routeId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`*`)
        .eq("route_id", routeId)
        .eq("booking_status", "confirmed");

      if (fetchError) throw fetchError;
      return data;
    } catch (err: any) {
      const message = err.message || "Error fetching route bookings";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setError(null);
      setLoading(true);

      // First, get the booking details BEFORE cancelling
      const { data: bookingData, error: fetchError } = await supabase
        .from("bookings")
        .select("id, route_id")
        .eq("id", bookingId)
        .single();

      if (fetchError) throw new Error("Reserva no encontrada");
      if (!bookingData) throw new Error("Reserva no existe");

      // Update booking status
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ booking_status: "cancelled", payment_status: "refunded" })
        .eq("id", bookingId);

      if (updateError) throw updateError;

      // Increment available_seats for the route
      if (bookingData.route_id) {
        // Get current available_seats value
        const { data: routeData, error: routeFetchError } = await supabase
          .from("routes")
          .select("available_seats")
          .eq("id", bookingData.route_id)
          .single();

        if (!routeFetchError && routeData) {
          const newAvailableSeats = (routeData.available_seats || 0) + 1;
          const { error: routeUpdateError } = await supabase
            .from("routes")
            .update({ available_seats: newAvailableSeats })
            .eq("id", bookingData.route_id);

          if (routeUpdateError) {
            console.warn("Error incrementing available seats:", routeUpdateError);
            // Don't throw - the booking was already cancelled
          }
        }
      }

      return bookingData;
    } catch (err: any) {
      const message = err.message || "Error cancelling booking";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBooking,
    getPassengerBookings,
    getRouteBookings,
    cancelBooking,
  };
};
