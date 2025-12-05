# CLIENT-SERVER ARCHITECTURE USING MYSQL

# Introduction

A **Client-Server Architecture** is a network-based computing model where responsibilities are divided between **clients** and **servers**:

* **Client** → Sends requests (e.g., retrieve data, insert records).
* **Server** → Processes requests and returns responses.

This architecture is widely used in:

* Email systems
* Web applications
* Online banking
* E-commerce platforms

In this guide, we will **implement a client-server architecture** using **MySQL** on **two AWS EC2 instances (Ubuntu)**

##  Prerequisites

Before starting, ensure you have:

* An **AWS account**
* Two **Ubuntu EC2 instances** in the same VPC/security group

  * **Server instance** (for MySQL Server)
  * **Client instance** (for MySQL Client)
* A **Key Pair (.pem file)** for SSH access 
* Security group rules allowing:

  * **Port 22 (SSH)** for management
  * **Port 3306 (MySQL)** for remote DB access

![The Architectural diagram](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/architectural%20diagram.PNG)


![Servers](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/servers.PNG)


![Security Group](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/Security_Group.PNG)


##  Steps Involved

### **1. Launch and Connect to EC2 Instances**


```bash
ssh -i <key-pair-name>.pem ubuntu@<ip-address>
```

 Used to **securely connect** to the Ubuntu EC2 instance from your local machine using the private key.

![SSH](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/ssh.PNG)


### **2. Update and Upgrade Packages**

```bash
sudo apt update && sudo apt upgrade -y
```

 Ensures the system package index is updated and all packages are upgraded to their latest versions.

### **3. Install MySQL Server (on the Server Instance)**


```bash
sudo apt install mysql-server -y
```

Installs the **MySQL server software** so this machine can act as a **database server**.

![MySQL Server Installation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/sql_install.PNG)


### **4. Configure MySQL for Remote Access**


```bash
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

 Opens the MySQL configuration file. Change:

```ini
bind-address = 127.0.0.1
```

To:

```ini
bind-address = 0.0.0.0
```

This allows MySQL to accept connections from **any IP address**, not just localhost.

![MySQL Configuration](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/vi.PNG)


**Restart MySQL**:

```bash
sudo systemctl restart mysql
```

 Applies the configuration changes.


### **5. Create a Remote User on MySQL**


```bash
sudo mysql -u root -p
```

 Logs into MySQL as the **root user** with password authentication.

 ![Remote User Creation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/sudo_root.PNG)


Inside MySQL shell, run:

```sql
CREATE USER 'ifeoma'@'%' IDENTIFIED BY 'Password.1';
GRANT ALL PRIVILEGES ON *.* TO 'ifeoma'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

 Explanation:

* `CREATE USER` → Creates a new MySQL user `dimma` with a password.
* `'%'` → Allows login from **any host** (remote access).
* `GRANT ALL PRIVILEGES` → Gives admin-like rights to this user.
* `FLUSH PRIVILEGES` → Reloads privilege tables so changes take effect.
* `EXIT` → Leaves the MySQL shell.

![Remote User Creation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/sudo_root1.PNG)


### **6. Setup the MySQL Client (on the Client Instance)**


```bash
sudo apt install mysql-client -y
```

Installs the **MySQL client utility** used to connect to remote MySQL servers.

![Client Server Installation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/client_install.PNG)


**Verify Installation**:

```bash
mysql --version
```

 Confirms that the MySQL client was installed correctly.

---

### **7. Connect from Client to Server**


```bash
mysql -u ifeoma -p -h <server-private-ip>
```

Example:

```bash
mysql -u ifeoma -p -h 10.0.1.93
```
 Connects the **client machine** to the **server’s MySQL instance** using the remote user credentials.

![Client to Server Connection](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/client_server_login.PNG)


### **8. Perform Database Operations**

1. **Show available databases**:

   ```sql
   SHOW DATABASES;
   ```

 Lists all existing databases.

 ![Show Databases](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/server_show_databases.PNG)


2. **Create a database**:

   ```sql
   CREATE DATABASE ifeoma;
   ```

    Creates a new database named `ifeoma`.

![Database Creation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/database_creation.PNG)

3. **Use the database**:

   ```sql
   USE ifeoma;
   ```

    Switches the current session to work inside the `ifeoma` database.

4. **Create a table**:

   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL
   );
   ```

    Defines a `users` table with `id`, `name`, and `email` fields.

    ![Table Creation](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/create_table_users.PNG)


5. **Insert data**:

   ```sql
   INSERT INTO users (name, email)
   VALUES ('Ifeoma Queendaline Okoye', 'ifeomaokoyequeen@gmail.com');
   ```

    Adds a sample user record into the `users` table.

6. **Verify data**:

   ```sql
   SELECT * FROM users;
   ```

    Displays all records from the `users` table.

    ![Users Select](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/select_users.PNG)


7. **Drop the table**:

   ```sql
   DROP TABLE users;
   ```

    Deletes the `users` table.

8. **Drop the database**:

   ```sql
   DROP DATABASE ifeoma;
   ```

    Deletes the `ifeoma` database.

    ![Database and Table Drop](https://raw.githubusercontent.com/Ifeomacloud/DevOps-Projects/main/mysql-client-server-architecture/images/drop_table.PNG)


9. **Exit MySQL**:

   ```sql
   EXIT;
   ```

    Ends the MySQL session.


##  Summary

We built a **Client-Server MySQL architecture** on AWS using EC2 instances:

* Installed and configured **MySQL server**
* Created a **remote user** with privileges
* Installed **MySQL client** on another machine
* Connected remotely to the server
* Performed **basic database operations** (create, insert, query, drop)

This demonstrates how real-world **applications and databases** communicate over a network.
