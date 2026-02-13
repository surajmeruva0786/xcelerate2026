import cv2
import numpy as np

# --------------------------
# 1. Load images
# --------------------------
base = cv2.imread("downloads\satellite_Kapan_2026-02-13.png")
overlay = cv2.imread("downloads\Kapan_2026-02-13.png")

if base is None or overlay is None:
    print("Image not found. Check path.")
    exit()

# --------------------------
# 2. Extract roads (white lines)
# --------------------------

def extract_roads(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Enhance white roads
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    
    # Edge detection
    edges = cv2.Canny(thresh, 50, 150)
    
    return edges

edges_base = extract_roads(base)
edges_overlay = extract_roads(overlay)

# --------------------------
# 3. Feature detection on edges only
# --------------------------
orb = cv2.ORB_create(8000)

kp1, des1 = orb.detectAndCompute(edges_base, None)
kp2, des2 = orb.detectAndCompute(edges_overlay, None)

if des1 is None or des2 is None:
    print("Feature detection failed.")
    exit()

bf = cv2.BFMatcher(cv2.NORM_HAMMING)
matches = bf.knnMatch(des1, des2, k=2)

# Lowe ratio test
good = []
for m, n in matches:
    if m.distance < 0.75 * n.distance:
        good.append(m)

if len(good) < 10:
    print("Not enough matches found.")
    exit()

pts_base = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1,1,2)
pts_overlay = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1,1,2)

# --------------------------
# 4. Compute Homography
# --------------------------
H, mask = cv2.findHomography(pts_overlay, pts_base, cv2.RANSAC, 5.0)

if H is None:
    print("Homography failed.")
    exit()

# --------------------------
# 5. Warp overlay image
# --------------------------
h, w, _ = base.shape
warped_overlay = cv2.warpPerspective(overlay, H, (w, h))

# --------------------------
# 6. Extract pink boundary
# --------------------------
hsv = cv2.cvtColor(warped_overlay, cv2.COLOR_BGR2HSV)

lower_pink = np.array([140, 50, 50])
upper_pink = np.array([170, 255, 255])

mask_pink = cv2.inRange(hsv, lower_pink, upper_pink)

# Clean mask
kernel = np.ones((3,3), np.uint8)
mask_pink = cv2.morphologyEx(mask_pink, cv2.MORPH_CLOSE, kernel)

# --------------------------
# 7. Overlay boundary
# --------------------------
result = base.copy()
result[mask_pink > 0] = [0, 0, 255]

cv2.imwrite("final_mapped_result.png", result)

print("SUCCESS! Check final_mapped_result.png")
