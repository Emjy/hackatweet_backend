function extractHashtags(content) {
    const hashtagRegex = /#(\w+)/g; // Expression régulière pour récupérer les hashtags
    const hashtags = content.match(hashtagRegex); // Utiliser match pour obtenir un tableau de hashtags

    // Si des hashtags sont trouvés, les stocker dans une variable, sinon initialiser la variable à un tableau vide
    const extractedHashtags = hashtags ? hashtags : [];

    return extractedHashtags;
}

module.exports = { extractHashtags } 