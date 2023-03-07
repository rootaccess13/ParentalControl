import pickle
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

# Load the saved model from the pickle file
with open('model.pkl', 'rb') as file:
    clf = pickle.load(file)

# Load the original training data
df_train = pd.read_csv("predict_2.csv")

# One-hot encode the categorical features in the training data
encoder = OneHotEncoder(handle_unknown='ignore')
encoder.fit(df_train[['url', 'phish_detail_url']])

# Create a DataFrame for the URL to be predicted
df = pd.DataFrame({'url': ["https://www.twitter.com"], 'phish_detail_url': ['http://www.phishtank.com/phish_detail.php?phish_id=8974']})

# One-hot encode the categorical features (url and phish_detail_url)
X_encoded = encoder.transform(df[['url', 'phish_detail_url']])

# Make predictions on the new data
y_pred = clf.predict(X_encoded)

# Print the prediction
print("Prediction:", y_pred[0])
