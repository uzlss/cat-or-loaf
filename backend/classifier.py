import tensorflow as tf


def preprocess(model, image_path):
    image_size = tuple(model.input_shape[1:3])
    image = tf.keras.utils.load_img(image_path, target_size=image_size)
    x = tf.keras.utils.img_to_array(image)
    x = tf.expand_dims(x, 0)
    return x


def classify(model, image_path):
    image = preprocess(model, image_path)
    score = float(
        model.predict(image, verbose=0)[0][0]
    )  # sigmoid prob of the positive class

    label = "loaf" if score >= 0.5 else "cat"
    prob = score if label == "loaf" else 1.0 - score
    return label, prob


if __name__ == "__main__":
    MODEL_PATH = "static/models/cat_or_loaf.h5"
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Expected cat: \n", classify(model, "static/images/my_cat.jpg"))
    print("Expected loaf: \n", classify(model, "static/images/my_loaf.jpg"))
