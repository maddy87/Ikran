FROM node:argon
RUN mkdir -p /usr/app/
COPY . /usr/app
WORKDIR /usr/app/eekran
EXPOSE 8899
CMD ["node","app.js"]

