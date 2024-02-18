from django.test import TestCase
from .models import User, Trip, Itinerary

class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(username="test", password="Abc123!?", email="test@test.com")
        User.objects.create(username="test2", password="Abc123!?", email="test2@test.com")
        User.objects.create(username="test3", password="Abc123!?", email="test3@test.com")

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
    pass

class ItineraryTestCase(TestCase):
    pass