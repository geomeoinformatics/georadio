/*
 * Copyright (c) 2017. Timeline. (http://www.tline.xyz) Gopikrishna V.M.
 */

package json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import java.io.IOException;

public class ObjectIdSerializer extends JsonSerializer<ObjectId> {
    private static final Logger logger = LoggerFactory.getLogger(ObjectIdSerializer.class);

    @Override
    public void serialize(ObjectId value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
        if (value != null) {
            gen.writeString(value.toString());
        } else {
            logger.error("Invalid ObjectId");
            throw new WebApplicationException("An error occurred", 500);
        }
    }
}
