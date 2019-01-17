# frozen_string_literal: true

require 'tree'
require 'trie'

describe 'Trie' do
  before :each do
    @trie = DataStructures::Trie.new
  end

  after :each do
    @trie = nil
  end

  it 'should insert words and validate them' do
    @trie.insert('hello')
    @trie.insert('hey')
    expect(@trie.validate_word('hello')).to be true
    expect(@trie.validate_word('hey')).to be true
    expect(@trie.validate_word('hell')).to be false
    expect(@trie.size).to eq 6
    @trie.clear
    expect(@trie.empty?).to be true
  end

  it 'should validate prefixes' do
    @trie.insert_all(%w[the quick brown fox jumps over lazy dog])
    expect(@trie.validate_prefix('qui')).to be true
    expect(@trie.validate_prefix('l')).to be true
    expect(@trie.validate_prefix('dog')).to be true
    expect(@trie.validate_prefix('asdf')).to be false
  end

  it 'should not allow duplicate words' do
    @trie.insert('hello')
    expect(@trie.insert('hello')).to be false
    expect(@trie.insert('he')).to be true
    expect(@trie.validate_word('he')).to be true
    expect(@trie.validate_word('hello')).to be true
    expect(@trie.validate_word('hel')).to be false
    expect(@trie.validate_word('asdf')).to be false
  end

  it 'should not allow words with space characters' do
    expect { @trie.insert('hello world') }.to raise_error 'Invalid word: hello world'
    expect { @trie.insert('hello         world') }.to raise_error 'Invalid word: hello         world'
    expect { @trie.insert('       helloworld     ') }.to raise_error 'Invalid word:        helloworld     '
    expect { @trie.insert('   ') }.to raise_error 'Invalid word:    '
    expect { @trie.insert("hello\tworld") }.to raise_error "Invalid word: hello\tworld"
    expect { @trie.insert("hello\nworld") }.to raise_error "Invalid word: hello\nworld"
    expect(@trie.empty?).to be true
  end
end
