#  LAMP Stack Project – StegHub DevOps Training

###  By: **Ifeoma Queendaline Okoye**

---

##  Project Overview

This project demonstrates the complete setup and configuration of a **LAMP Stack** (Linux, Apache, MySQL, PHP) on an **AWS EC2 Ubuntu 24.04 LTS instance**.

LAMP is a proven open-source technology stack used to develop and deploy dynamic web applications.  
It is reliable, scalable, and cost-effective — ideal for both production and learning environments.

---

##  Tech Stack

| Component | Description |
|------------|--------------|
| **Linux** | Ubuntu 24.04 LTS (Operating System) |
| **Apache** | Web Server |
| **MySQL** | Database Server |
| **PHP** | Server-side Scripting Language |
| **AWS EC2** | Cloud Infrastructure Provider |
| **VSCode** | SSH Access & Code Editing |
| **GitHub** | Version Control & Documentation |

---

##  Prerequisites

- ✅ AWS EC2 Ubuntu 24.04 LTS Instance  
- ✅ Security Group: **lamp-SG** (Ports `22` for SSH and `80` for HTTP)  
- ✅ Key Pair: **mykey.pem** for SSH authentication  
- ✅ GitBash for SSH access and code editing  
- ✅ Stable Internet Connection  
- ✅ AWS CLI (optional for resource management)  
- ✅ Basic Linux command-line knowledge  
- ✅ Web Browser (Chrome) for verification of Apache/PHP pages
---

##  Implementation Steps

### 1️⃣ Connect to EC2 Instance

```bash
chmod 400 mykey.pem
ssh -i mykey.pem ubuntu@<Public-IP>

##  Update System Packages

```bash
sudo apt update && sudo apt upgrade
# Installs Apache, the web server that handles HTTP requests and serves web pages.

```bash
sudo systemctl status apache2
# Checks the status of the Apache service to confirm it is running.

```bash
curl http://localhost:80
# Tests if the Apache server is serving content locally via port 80.

```bash
Browser Check (Apache Test Page):
In Browser: http://<Your-Public-IP>
Example: http://16.170.238.160
Expected Result: Default Apache Ubuntu landing page.

### Retrieve EC2 Public IP (Securely using IMDSv2)

Run the following commands to retrieve your EC2 instance’s public IP address securely via **Instance Metadata Service v2 (IMDSv2):**

```bash
# Generate a metadata access token (valid for 6 hours)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds:21600")

# Retrieve the public IPv4 address of the EC2 instance
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/public-ipv4

  ###  Install MySQL (Database)

Run the following command to install the MySQL server package:

```bash
sudo apt update
sudo apt install mysql-server -y

### Access the MySQL Shell

After installing MySQL, access the MySQL command-line interface by running:

```bash
sudo mysql

###  Secure the MySQL Installation

Once inside the MySQL prompt, update the root user’s authentication method and set a password.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Password.1';
EXIT;

After exiting MySQL, run the secure installation script:

```sql
sudo mysql_secure_installation

## mysql_secure_installation — Prompts & Responses

Below is an example interactive session with `mysql_secure_installation`.  
User inputs are shown **bold**.

Would you like to setup VALIDATE PASSWORD plugin? Y/n Y
There are three levels of password validation policy:
LOW Length >= 8
MEDIUM Length >= 8, numeric, mixed case, special chars
STRONG Length >= 8, numeric, mixed case, special chars, dictionary file
Please enter 0 = LOW, 1 = MEDIUM, 2 = STRONG: 1

New password: Ifeoma***4
Re-enter new password: Ifeoma***4

Estimated strength of the password: 100
Do you wish to continue with the password provided? (Press y|Y for Yes, any other key for No): Y

Remove anonymous users? (Press y|Y for Yes, any other key for No): Y
Disallow root login remotely? (Press y|Y for Yes, any other key for No): Y
Remove test database and access to it? (Press y|Y for Yes, any other key for No): Y
Reload privilege tables now? (Press y|Y for Yes, any other key for No): Y

###  Install PHP and Required Modules

Run the following commands to install PHP and integrate it with Apache and MySQL:

```bash
sudo apt install php libapache2-mod-php php-mysql
# Installs PHP and required modules for Apache and MySQL integration.

php -v
# Verifies PHP installation.

### Create Project Directory & Set Permissions

Run the following commands to create your project directory and set proper permissions:

```bash
sudo mkdir /var/www/lampstack
# Creates a project directory where web files will be served from.

sudo chown -R $USER:$USER /var/www/lampstack
# Transfers ownership of the project directory to the current user for easier management.

Tip:

/var/www/lampstack will serve as your web root for this project.

The ownership change ensures you can edit files in this directory without using sudo.

### Configure Apache Virtual Host

Run the following command to create and edit your Apache virtual host configuration:

```bash
sudo vi /etc/apache2/sites-available/lampstack.conf

Then paste the following configuration:

```bash
<VirtualHost *:80>
       ServerName lampstack
       ServerAlias www.lampstack
       ServerAdmin webmaster@localhost
       DocumentRoot /var/www/lampstack
<Directory /var/www/lampstack>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>


###  List Available Apache Sites

Run the following command to see all virtual host configuration files available on your server:

```bash
sudo ls /etc/apache2/sites-available


###  Enable Your Apache Virtual Host

Run the following commands to enable your new site, disable the default site, and test the configuration:

```bash
sudo a2ensite lampstack.conf
# Enables your custom virtual host configuration

sudo a2dissite 000-default.conf
# Disables the default Apache site

sudo apache2ctl configtest
# Tests Apache configuration for syntax errors


###  Create Custom Web Page with EC2 Public IP

Run the following commands to generate a simple HTML page that shows the server hostname and public IP:

```bash
# Generate a metadata access token (IMDSv2)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
-H "X-aws-ec2-metadata-token-ttl-seconds:21600")

# Create an HTML page displaying hostname and public IP
echo "<html><body><h1>Hello LAMP from $(hostname) with public IP $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)</h1></body></html>" | sudo tee /var/www/lampstack/index.html

### Browser Check (Custom HTML Page)

After completing the setup and creating your custom HTML page, open a web browser and navigate to your server’s public IP:

http://<EC2_PUBLIC_IP>

**Example:**

http://3.238.182.163


**Expected Result:**

Hello LAMP from <hostname> with public IP <your-ip>


###  Prioritize PHP Files and Test PHP Configuration

#### 1️⃣ Prioritize PHP Files in Apache

Edit the `dir.conf` file to make `index.php` load before `index.html`:

```bash
sudo vim /etc/apache2/mods-enabled/dir.conf
# Add index.php first in the DirectoryIndex list.

Reload Apache to apply the changes:
```bash
sudo systemctl reload apache2

2️⃣ Test PHP Configuration

Create a test PHP page in your project directory:
```bash
vim /var/www/lampstack/index.php

Then paste the following content:
```php
<?php
phpinfo();
?>


Browser Check (PHP Info Page): In Browser: http:// Example: http://3.238.182.163 Expected Result: A PHP configuration page.


###  Remove PHP Info File

After verifying PHP is working, remove the test PHP info file for security reasons:

```bash
sudo rm /var/www/lampstack/index.php
# Removes the PHP info file after verification for security reasons.

###  Security Note

A. Keeping `phpinfo()` publicly accessible is a security risk because it exposes server configuration details.  

B. Only remove it after confirming PHP works correctly.



