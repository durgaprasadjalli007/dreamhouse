public with sharing class PropertyController {

    @AuraEnabled(cacheable=true)
    public static List<Property__c> getFilteredProperties(
        String city,
        String type,
        String status,
        Decimal minPrice,
        Decimal maxPrice,
        Integer minBedrooms
    ) {
        String baseQuery = 'SELECT Id, Name, Listing_Price__c, Location__c, Bedrooms__c, ' +
                           'Bathrooms__c, Property_Type__c, Property_Status__c, Square_Footage__c, ' +
                           'Property_Address__c, Is_Favorite__c, ' +
                           '(SELECT Id, Image_Url__c FROM Property_Images__r) ' +
                           'FROM Property__c WHERE Id != null';

        if (String.isNotBlank(city)) baseQuery += ' AND Location__c = :city';
        if (String.isNotBlank(type)) baseQuery += ' AND Property_Type__c = :type';
        if (String.isNotBlank(status)) baseQuery += ' AND Property_Status__c = :status';
        if (minPrice != null) baseQuery += ' AND Listing_Price__c >= :minPrice';
        if (maxPrice != null) baseQuery += ' AND Listing_Price__c <= :maxPrice';
        if (minBedrooms != null) baseQuery += ' AND Bedrooms__c >= :minBedrooms';

        return Database.query(baseQuery + ' WITH SECURITY_ENFORCED');
    }

    @AuraEnabled
    public static Boolean toggleFavorite(Id propertyId, Boolean isFavorite) {
        try {
            Property__c prop = [SELECT Id, Is_Favorite__c FROM Property__c WHERE Id = :propertyId LIMIT 1];
            prop.Is_Favorite__c = isFavorite;
            update prop;
            return true;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating favorite: ' + e.getMessage());
        }
    }
}
