FROM nginx:1.15
COPY build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /volume/images