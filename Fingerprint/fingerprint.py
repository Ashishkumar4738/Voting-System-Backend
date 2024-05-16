import cv2
import numpy as np

def match_fingerprints(image1, image2):
    # Load fingerprint images
    img1 = cv2.imread(image1, 0)  # Load as grayscale
    img2 = cv2.imread(image2, 0)  # Load as grayscale

    # Check if images are loaded successfully
    if img1 is None or img2 is None:
        print("Error: Unable to load one or both images.")
        return None

    # Initialize the ORB detector
    orb = cv2.ORB_create()

    # Find the keypoints and descriptors with ORB
    kp1, des1 = orb.detectAndCompute(img1, None)
    kp2, des2 = orb.detectAndCompute(img2, None)

    # Create BFMatcher object
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    # Match descriptors
    matches = bf.match(des1, des2)

    # Sort them in the order of their distance
    matches = sorted(matches, key=lambda x: x.distance)

    # Avoid division by zero
    if len(kp1) == 0:
        print("Error: No keypoints found in the first image.")
        return None

    # Compute matching percentage
    matching_percentage = (len(matches) / len(kp1)) * 100

    return matching_percentage

if __name__ == "__main__":
    image1_path = r"C:\Users\av007\Blockchain\TestingBlockchain\contract\Fingerprint\assests\fing1.jpg"  # Replace with the path to your first fingerprint image
    image2_path = r"C:\Users\av007\Blockchain\TestingBlockchain\contract\Fingerprint\assests\fing2.jpg"  # Replace with the path to your second fingerprint image

    matching_percentage = match_fingerprints(image1_path, image2_path)
    if matching_percentage is not None:
        print("Matching Percentage:", matching_percentage, "%")

