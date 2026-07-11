SELECT 'CREATE DATABASE rwa_lat_test OWNER rwa'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rwa_lat_test')\gexec
