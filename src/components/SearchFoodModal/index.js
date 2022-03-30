import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Modal, ScrollView } from 'react-native';

import {
  Searchbar,
  IconButton,
  DataTable,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { debounce } from 'lodash';

import IconDataNotFound from '../../../assets/data_not_found.svg';
import CustomText from '../CustomText';
import FallbackMessage from '../FallbackMessage';
import { translateText } from '../../services/translate';
import { getFoodsNutritionalInfos } from '../../services/food';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const SearchFoodModal = ({ isOpen = false, onClose = () => null }) => {
  const { width, height } = Dimensions.get('screen');
  const { $secondary } = theme;
  const styles = getStyle({ width, height });
  const [isLoading, setIsLoading] = useState(false);
  const [foodResults, setFoodResults] = useState({
    results: [],
    totalPages: 0,
    totalResults: 0,
  });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);

  const [page, setPage] = useState(1);

  const handleTranslateAndSearchFood = async ({ query = '', page = 1 }) => {
    setIsLoading(true);
    try {
      const { data } = await translateText({ query });
      const { translatedText } = data?.data?.translations[0];

      const response = await getFoodsNutritionalInfos({
        query: translatedText,
        page,
      });

      const results = await Promise.all(
        response?.data?.foods?.map(async (item) => {
          const { data } = await translateText({
            query: item?.description,
            targetLang: 'pt',
            sourceLang: 'en',
          });
          const { translatedText } = data?.data?.translations[0];
          return {
            ...item,
            description: translatedText,
          };
        })
      );

      return {
        results,
        totalResults: response?.data?.totalHits,
        totalPages: response?.data?.totalPages,
      };
    } catch (error) {
      console.log('handleTranslateAndSearchFood error: ', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!!query) {
        const results = await handleTranslateAndSearchFood({ query });
        setFoodResults(results);
      }
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChangePage = async (page) => {
    if (!!searchQuery) {
      setPage(page);
      const results = await handleTranslateAndSearchFood({
        query: searchQuery,
        page: page,
      });

      setFoodResults(results);
    }
  };

  const onChangeSearch = (query) => {
    if (!query) {
      setFoodResults({
        results: [],
        totalPages: 0,
        totalResults: 0,
      });
      setPage(1);
    }

    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleClose = () => {
    setSearchQuery('');
    setFoodResults({
      results: [],
      totalPages: 0,
      totalResults: 0,
    });
    setPage(1);

    !!onClose && onClose();
  };

  const isFoodSelected = (food = {}, selectedFoods = []) => {
    return !!selectedFoods?.find((item) => item?.fdcId === food?.fdcId);
  };

  const handleSelectFood = (food, selectedFoods) => {
    if (isFoodSelected(food, selectedFoods)) {
      setSelectedFoods((prev) => {
        const filteredFoods = prev?.filter(
          (selectedFood) => selectedFood?.fdcId !== food?.fdcId
        );

        return filteredFoods;
      });
    } else {
      setSelectedFoods((prev) => [
        ...prev,
        { fdcId: food?.fdcId, description: food?.description },
      ]);
    }
  };

  return (
    <Modal visible={isOpen} transparent onDismiss={handleClose}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <CustomText weight="bold" style={styles.modalHeaderTitle}>
              Pesquisar alimento
            </CustomText>
            <IconButton
              style={styles.closeButton}
              color={$secondary}
              icon="close"
              onPress={handleClose}
              size={24}
            />
          </View>
          <Searchbar
            placeholder="Digite o nome do alimento"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />

          {isLoading && (
            <View style={styles.loadingBox}>
              <CustomText style={styles.searchingText}>Pesquisando</CustomText>
              <ActivityIndicator size={16} color={$secondary} />
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {selectedFoods?.map((item) => (
                <Chip
                  theme={{ colors: { text: $secondary } }}
                  key={item?.fdcId}
                  mode="outlined"
                  style={{ margin: 4, borderWidth: 1, borderColor: $secondary }}
                  textStyle={{ color: $secondary }}
                  onClose={() => handleSelectFood(item, selectedFoods)}
                >
                  {item?.description}
                </Chip>
              ))}
            </View>
            {foodResults?.results?.length > 0 && (
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title>Nome</DataTable.Title>
                  <DataTable.Title numeric style={styles.cho}>
                    CHO(g)
                  </DataTable.Title>
                  <DataTable.Title numeric style={styles.measure}>
                    Porção(g)
                  </DataTable.Title>
                </DataTable.Header>

                {foodResults?.results?.map((food) => {
                  const choId = '205';
                  const choInfos = food?.foodNutrients?.find(
                    (item) => item?.nutrientNumber === choId
                  );
                  const choValue = choInfos?.value;

                  return (
                    !!choValue && (
                      <DataTable.Row
                        key={food?.fdcId}
                        onPress={() => handleSelectFood(food, selectedFoods)}
                        style={
                          isFoodSelected(food, selectedFoods)
                            ? styles.modalSelectedRow
                            : styles.modalRow
                        }
                      >
                        <DataTable.Cell>
                          <CustomText
                            style={
                              isFoodSelected(food, selectedFoods)
                                ? styles.modalSelectedText
                                : styles.modalText
                            }
                          >
                            {food?.description}
                          </CustomText>
                        </DataTable.Cell>
                        <DataTable.Cell numeric style={styles.cho}>
                          <CustomText
                            style={
                              isFoodSelected(food, selectedFoods)
                                ? styles.modalSelectedText
                                : styles.modalText
                            }
                          >
                            {choValue}
                          </CustomText>
                        </DataTable.Cell>
                        <DataTable.Cell numeric style={styles.measure}>
                          <CustomText
                            style={
                              isFoodSelected(food, selectedFoods)
                                ? styles.modalSelectedText
                                : styles.modalText
                            }
                          >
                            100
                          </CustomText>
                        </DataTable.Cell>
                      </DataTable.Row>
                    )
                  );
                })}

                <DataTable.Pagination
                  page={page - 1}
                  numberOfPages={foodResults?.totalPages}
                  onPageChange={(page) => handleChangePage(page + 1)}
                  label={`${page} de ${foodResults?.totalPages}`}
                  itemsPerPage={10}
                />
              </DataTable>
            )}
            {!selectedFoods?.length > 0 &&
              foodResults?.results?.length === 0 && (
                <FallbackMessage
                  customIcon={
                    <IconDataNotFound
                      color={$secondary}
                      width={100}
                      height={100}
                    />
                  }
                  title="Nenhum alimento selecionado"
                  subtitle="Pesquise e selecione todos os alimentos da refeição"
                />
              )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SearchFoodModal;
