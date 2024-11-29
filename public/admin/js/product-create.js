// Show Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const removeButton = document.getElementById("removeButton");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            removeButton.style.display = "block"; // Show the remove button
        }
    });

    if (uploadImagePreview.src){
        removeButton.style.display = "block"; // Show the remove button
    }

    removeButton.addEventListener("click", () => {
        uploadImageInput.value = ""; // Clear the file input
        uploadImagePreview.src = ""; // Clear the image preview
        removeButton.style.display = "none"; // Hide the remove button
    });
}
// Show Image