FROM node:lts-alpine

ARG UID=1000
ARG GID=1000

USER root
RUN apk add --no-cache \
    # Node Compilation stuff
    # ! FIXME - Might need python2 if build breaks!!! Upstream node image changed base, and `python` doesn't exist anymore, so python3 is a fillin, but again if build breaks, try python2
    g++ gcc libgcc libstdc++ linux-headers make python3 git fts-dev \
    # User MGMT stuff
    shadow sudo && \
    if [ -z "`getent group $GID`" ]; then \
      addgroup -S -g $GID abc; \
    else \
      groupmod -n abc `getent group $GID | cut -d: -f1`; \
    fi && \
    if [ -z "`getent passwd $UID`" ]; then \
      adduser -S -u $UID -G abc -s /bin/sh abc; \
    else \
      usermod -l abc -g $GID -d /home/abc -m `getent passwd $UID | cut -d: -f1`; \
    fi

RUN chown abc:abc /home/abc

USER abc

##################################################################

WORKDIR /build

COPY ./package.json .
RUN npm i

COPY . ./

CMD ["node", "."]
