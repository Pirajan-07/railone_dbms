CREATE DATABASE IF NOT EXISTS railway_system;
USE railway_system;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  phone VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS trains (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    train_number INT UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time VARCHAR(20),
    arrival_time VARCHAR(20),
    train_type VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS train_classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    class_type VARCHAR(20) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  pnr VARCHAR(20) UNIQUE,
  user_id INT,
  train_id INT,
  travel_date DATE,
  number_of_tickets INT NOT NULL,
  seat_numbers VARCHAR(255),
  total_price INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Booked',
  class_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES train_classes(class_id)
);

CREATE TABLE IF NOT EXISTS passengers (
  passenger_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  name VARCHAR(100),
  age INT,
  gender VARCHAR(10),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS train_routes (
  route_id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT,
  station_name VARCHAR(100),
  stop_number INT,
  FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
);
