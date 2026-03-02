import sys

path = '/etc/nginx/sites-available/herbalhot.shop'
try:
    with open(path, 'r') as f:
        config = f.read()
except FileNotFoundError:
    print(f"File {path} not found.")
    sys.exit(1)

new_block = """
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
"""

if 'location /api/' not in config:
    # Need to match the 'location / {' block inside the educrusts.online server block specifically
    # but the simplest way is to find the educrusts.online block first.
    server_educrusts_idx = config.find('server_name educrusts.online')
    if server_educrusts_idx == -1:
        print("educrusts.online server block not found.")
        sys.exit(1)
    
    loc_idx = config.find('location / {', server_educrusts_idx)
    if loc_idx == -1:
        print("location / block not found after educrusts.online.")
        sys.exit(1)
        
    new_config = config[:loc_idx] + new_block + "\n    " + config[loc_idx:]
    with open('/tmp/nginx_patched.conf', 'w') as f:
        f.write(new_config)
    print("OK")
else:
    print("ALREADY_PATCHED")
