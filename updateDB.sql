INSERT INTO role (name) VALUES ('Admin');
INSERT INTO role (name) VALUES ('Lærer');
INSERT INTO role (name) VALUES ('Elev');
INSERT INTO role (name) VALUES ('Miljøfagarbeider');
INSERT INTO role (name) VALUES ('IT-medarbeider');

INSERT INTO computer (name, built, model) VALUES ('PC1', 2019, 'HP EliteDesk 800 G5');
INSERT INTO computer (name, built, model) VALUES ('PC2', 2020, 'Lenovo ThinkPad E14');
INSERT INTO computer (name, built, model) VALUES ('PC3', 2022, 'Dell OptiPlex 7080');

INSERT INTO permission (name) VALUES ('Full access');
INSERT INTO permission (name) VALUES ('Limited access');

INSERT INTO address (street, city, zip_code, country) VALUES ('falskgate 31', 'Oslo', 1234, 'Norway');

INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, mobile)
VALUES ('johndoe', 'John', 'Doe', 'password123', 1, 1, 1, '12345678');
INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, mobile)
VALUES ('janedoe', 'Jane', 'Doe', 'password123', 1, 3, 1, '12345678');
INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, mobile)
VALUES ('test', 'test', 'test', 'test', 1, 2, 1, '12345678');
INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, mobile)
VALUES ('ITtest', 'ITtest', 'ITtest', 'ITtest', 1, 5, 1, '12345678');
INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, mobile)
VALUES ('test2', 'test2', 'test2', 'password123', 1, 4, 1, '12345678');
