from django.test import TestCase
from .models import User, Trip, Itinerary
from datetime import date, time


class TripTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(username="test", password="Abc123!?", email="test@test.com")

        trip1 = Trip.objects.create(tripname="test", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Brussels', hotel='ChIJqbYws4DDw0cRm9YDlU553IE', owner=user1)
        trip1.members.set([]) 

        trip2 = Trip.objects.create(tripname="test2", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Brussels', hotel='ChIJaeKKqIDDw0cRPHsrdUp26hc', owner=user1)
        trip2.members.set([user1]) 

        trip3 = Trip.objects.create(tripname="test3", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Antwerp', hotel='ChIJ64INZPz2w0cRz3p-pO-wC-8', owner=user1)
        trip3.members.set([])  



    def test_users_created_correctly(self):
        user1 = User.objects.get(username="test")
        user2 = User.objects.get(username="test2")
        user3 = User.objects.get(username="test3")

        self.assertEqual(user1.username, "test")
        self.assertEqual(user1.email, "test@test.com")

        self.assertEqual(user2.username, "test2")
        self.assertEqual(user2.email, "test2@test.com")

        self.assertEqual(user3.username, "test3")
        self.assertEqual(user3.email, "test3@test.com")

class TripTestCase(TestCase):
    def setUp(self):
        User.objects.create(username="test", password="Abc123!?", email="test@test.com")
        user1 = User.objects.get(username="test")
        User.objects.create(username="tester", password="Abc123!?", email="test1@test.com")
        user2 = User.objects.get(username="tester")

        trip1 = Trip.objects.create(tripname="test", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Brussels', hotel='ChIJqbYws4DDw0cRm9YDlU553IE', owner=user1)
        trip1.members.set([]) 

        trip2 = Trip.objects.create(tripname="test2", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Brussels', hotel='ChIJaeKKqIDDw0cRPHsrdUp26hc', owner=user1)
        trip2.members.set([user2]) 

        trip3 = Trip.objects.create(tripname="test3", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Antwerp', hotel='ChIJ64INZPz2w0cRz3p-pO-wC-8', owner=user1)
        trip3.members.set([user2])

    def test_trips_created_correctly(self):
        user1 = User.objects.get(username="test")
        user2 = User.objects.get(username="tester")

        trip1 = Trip.objects.get(tripname="test")
        trip2 = Trip.objects.get(tripname="test2")
        trip3 = Trip.objects.get(tripname="test3")

        self.assertEqual(trip1.tripname, "test")
        self.assertEqual(trip1.startDate, date(2025, 1, 1))
        self.assertEqual(trip1.endDate, date(2025, 1, 2))
        self.assertEqual(trip1.country, "Belgium")
        self.assertEqual(trip1.city, "Brussels")
        self.assertEqual(trip1.hotel, "ChIJqbYws4DDw0cRm9YDlU553IE")
        self.assertEqual(trip1.owner, user1)
        self.assertEqual(trip1.members.count(), 0) 

        self.assertEqual(trip2.tripname, "test2")
        self.assertEqual(trip2.startDate, date(2025, 1, 1))
        self.assertEqual(trip2.endDate, date(2025, 1, 2))
        self.assertEqual(trip2.country, "Belgium")
        self.assertEqual(trip2.city, "Brussels")
        self.assertEqual(trip2.hotel, "ChIJaeKKqIDDw0cRPHsrdUp26hc")
        self.assertEqual(trip2.owner, user1)
        self.assertEqual(trip2.members.count(), 1) 

        self.assertEqual(trip3.tripname, "test3")
        self.assertEqual(trip3.startDate, date(2025, 1, 1))
        self.assertEqual(trip3.endDate, date(2025, 1, 2))
        self.assertEqual(trip3.country, "Belgium")
        self.assertEqual(trip3.city, "Antwerp")
        self.assertEqual(trip3.hotel, "ChIJ64INZPz2w0cRz3p-pO-wC-8")
        self.assertEqual(trip3.owner, user1)
        self.assertEqual(trip3.members.count(), 1)



class ItineraryTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(username="test", password="Abc123!?", email="test@test.com")
        trip1 = Trip.objects.create(tripname="test", startDate="2025-01-01", endDate="2025-01-02", country='Belgium', city='Brussels', hotel='ChIJqbYws4DDw0cRm9YDlU553IE', owner=user1)

        Itinerary.objects.create(trip_id=trip1, date="2025-01-01", start=time(9, 0), end=time(17, 0), activities=['ChIJi_Vw6YfDw0cRTfk6uxe6WNw;555;645;breakfast;50.8491801;4.3472788', 'ChIJE4yZ0JrDw0cR-krI0qdwTLg;660;870;zoo;50.858863;4.350427499999999'])

    def test_itinerary_created_correctly(self):
        itinerary1 = Itinerary.objects.get(date="2025-01-01")

        self.assertEqual(itinerary1.date, date(2025, 1, 1))
        self.assertEqual(itinerary1.start, time(9, 0))
        self.assertEqual(itinerary1.end, time(17, 0))
        self.assertEqual(itinerary1.activities, ['ChIJi_Vw6YfDw0cRTfk6uxe6WNw;555;645;breakfast;50.8491801;4.3472788', 'ChIJE4yZ0JrDw0cR-krI0qdwTLg;660;870;zoo;50.858863;4.350427499999999'])

    def test_itinerary_belongs_to_trip(self):
        itinerary1 = Itinerary.objects.get(date="2025-01-01")
        trip1 = itinerary1.trip_id

        self.assertEqual(trip1.tripname, "test")
        self.assertEqual(trip1.city, "Brussels")