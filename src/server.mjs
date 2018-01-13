import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import fetch from 'node-fetch';
import parser from 'xml2json-light';

const port = (process.env.PORT || 5000);
const app = new Koa();

// middlewares
app.use(bodyParser());
app.use(json());
app.use(logger());


app.use(async ctx => {
    //console.log(ctx.url);
    const cacheDay = 1;
    const secInDay = 24 * 60 * 60;

    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    ctx.set('Cache-Control', 'max-age=' + (cacheDay * secInDay));

    ctx.body = await fetch("https://www.openstreetmap.org" + ctx.url)
        .then(response => response.text()).then(function (xml) {
            const json = parser.xml2json(xml);

            json.bounds = [
                [json.osm.bounds.minlat, json.osm.bounds.minlon],
                [json.osm.bounds.maxlat, json.osm.bounds.maxlon]
            ];
            json.relation = _preprocessingReduce(json.osm.relation);
            json.way = _preprocessingReduce(json.osm.way);
            json.node = _preprocessingReduce(json.osm.node);
            delete(json.osm);

            return json;
        });
});

const _preprocessingReduce = function (data) {
    return (data || []).reduce(function (acc, currentNode) {
        const id = currentNode.id;
        const newTag = _preprocessingTag(currentNode.tag);

        if (newTag) {
            currentNode.tag = newTag;
        }

        if (currentNode && currentNode.lat && currentNode.lon) {
            currentNode.LatLng = [currentNode.lat, currentNode.lon];
            delete(currentNode.lat);
            delete(currentNode.lon);
        }

        delete(currentNode.changeset);
        delete(currentNode.id);
        delete(currentNode.timestamp);
        delete(currentNode.uid);
        delete(currentNode.user);
        delete(currentNode.version);
        delete(currentNode.visible);

        acc[id] = currentNode;

        return acc;
    }, {});
};

const _preprocessingTag = function (tag) {
    let newTag = null;

    if (tag instanceof Array) {
        newTag = (tag || []).reduce(function (accTag, tag) {
            accTag[tag.k] = tag.v;

            return accTag;
        }, {});
    } else if (tag instanceof Object) {
        newTag = {};
        newTag[tag.k] = tag.v;
    }

    return newTag;
};


app.listen(port);