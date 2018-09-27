/*
 * Copyright (c) 2017. Timeline. (http://www.tline.xyz) Gopikrishna V.M.
 */

package json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import java.io.IOException;

public class ObjectIdDeserializer extends JsonDeserializer<ObjectId> {
    private static final Logger logger = LoggerFactory.getLogger(ObjectIdDeserializer.class);

    @Override
    public ObjectId deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        if (p.hasCurrentToken()) {
            String value = p.getValueAsString();
            return new ObjectId(value);
        } else {
            logger.error("Invalid ObjectId");
            throw new WebApplicationException("An error occurred", 500);
        }
    }
}
