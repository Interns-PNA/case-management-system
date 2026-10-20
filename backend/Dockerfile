FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Keep the bundled sample uploads outside the runtime uploads path so the
# entrypoint can seed an empty persistent volume (e.g. an Azure Files mount).
RUN chmod +x docker-entrypoint.sh \
 && if [ -d uploads ]; then mv uploads uploads-seed; fi \
 && mkdir -p uploads

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
